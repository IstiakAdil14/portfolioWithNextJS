import dbConnect from "../../../../server/utils/dbConnect";
import ClientProfile from "../../../../server/models/ClientProfile";
import ClientUser from "../../../../server/models/ClientUser";

import jwt from "jsonwebtoken";

async function getUserIdFromRequest(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export default async function handler(req, res) {
  await dbConnect();

  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const profile = await ClientProfile.findOne({ clientUserId: userId });
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      return res.status(200).json(profile);
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  } else if (req.method === "PUT") {
    try {
      const { name, phone, address } = req.body;
      let profile = await ClientProfile.findOne({ clientUserId: userId });
      if (profile) {
        profile.name = name || profile.name;
        profile.phone = phone || profile.phone;
        profile.address = address || profile.address;
        await profile.save();
      } else {
        profile = new ClientProfile({
          clientUserId: userId,
          name,
          phone,
          address,
        });
        await profile.save();
      }
      return res.status(200).json(profile);
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
