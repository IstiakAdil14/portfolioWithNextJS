import dbConnect from "../../../../server/utils/dbConnect";
import ClientOrder from "../../../../server/models/ClientOrder";

// Placeholder function to get userId from request (to be replaced with real auth)
async function getUserIdFromRequest(req) {
  return req.headers["x-user-id"] || null;
}

export default async function handler(req, res) {
  await dbConnect();

  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const orders = await ClientOrder.find({ clientUserId: userId }).sort({
        orderDate: -1,
      });
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
