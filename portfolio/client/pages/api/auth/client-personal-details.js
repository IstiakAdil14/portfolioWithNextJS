import dbConnect from "../../../../server/utils/dbConnect";
import ClientPersonalDetails from "../../../../server/models/ClientPersonalDetails";
import ClientUser from "../../../../server/models/ClientUser";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb", // Increase the body size limit to 5MB to accept base64 images
    },
  },
};

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { email } = req.query;
    console.log("GET /client-personal-details called with email:", email);

    if (!email) {
      console.error("Email query parameter missing");
      return res
        .status(400)
        .json({ message: "Email query parameter is required" });
    }

    try {
      console.log("Querying ClientPersonalDetails with email:", email);
      const personalDetails = await ClientPersonalDetails.findOne({ email });
      if (!personalDetails) {
        console.error("Personal details not found for email:", email);
        return res.status(404).json({ message: "Personal details not found" });
      }

      // Format the response data
      const formattedDetails = {
        id: personalDetails._id.toString(),
        clientUserId: personalDetails.clientUserId.toString(),
        email: personalDetails.email,
        fullName: personalDetails.fullName,
        phoneNumber: personalDetails.phoneNumber,
        address: personalDetails.address,
        dateOfBirth: personalDetails.dateOfBirth
          ? personalDetails.dateOfBirth.toISOString()
          : null,
        gender: personalDetails.gender,
        profilePicture: personalDetails.profilePicture,
        createdAt: personalDetails.createdAt
          ? personalDetails.createdAt.toISOString()
          : null,
        updatedAt: personalDetails.updatedAt
          ? personalDetails.updatedAt.toISOString()
          : null,
      };

      console.log("Personal details found:", formattedDetails);

      return res.status(200).json(formattedDetails);
    } catch (error) {
      console.error("Error fetching personal details:", error);
      return res.status(500).json({ message: "Server error" });
    }
  } else if (req.method === "POST") {
    const {
      email,
      fullName,
      phoneNumber,
      address,
      dateOfBirth,
      gender,
      profilePicture,
    } = req.body;

    console.log("POST /client-personal-details called with body:", req.body);

    if (!email || !fullName) {
      console.error("Email or fullName missing in request body");
      return res
        .status(400)
        .json({ message: "Email and fullName are required" });
    }

    try {
      // Find client user by email
      const clientUser = await ClientUser.findOne({ email });
      if (!clientUser) {
        console.error("Client user not found for email:", email);
        return res.status(404).json({ message: "Client user not found" });
      }

      // Find existing personal details by email or create new
      let personalDetails = await ClientPersonalDetails.findOne({ email });

      if (personalDetails) {
        // Update existing
        personalDetails.fullName = fullName;
        personalDetails.phoneNumber = phoneNumber;
        personalDetails.address = address;
        personalDetails.dateOfBirth = dateOfBirth;
        personalDetails.gender = gender;
        personalDetails.profilePicture = profilePicture;
      } else {
        // Create new
        personalDetails = new ClientPersonalDetails({
          clientUserId: clientUser._id,
          email,
          fullName,
          phoneNumber,
          address,
          dateOfBirth,
          gender,
          profilePicture,
        });
      }

      await personalDetails.save();

      console.log("Personal details saved successfully for email:", email);

      // Cleanup old images in public/uploads except current profilePicture
      const fs = require("fs");
      const path = require("path");
      const uploadsDir = path.join(process.cwd(), "public/uploads");

      fs.readdir(uploadsDir, (err, files) => {
        if (err) {
          console.error("Error reading uploads directory:", err);
          return;
        }
        files.forEach((file) => {
          const filePath = `/uploads/${file}`;
          if (filePath !== profilePicture) {
            const fullPath = path.join(uploadsDir, file);
            fs.unlink(fullPath, (unlinkErr) => {
              if (unlinkErr) {
                console.error("Error deleting file:", fullPath, unlinkErr);
              } else {
                console.log("Deleted old upload file:", fullPath);
              }
            });
          }
        });
      });

      return res
        .status(200)
        .json({ message: "Personal details saved successfully" });
    } catch (error) {
      console.error("Error saving personal details:", error);
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
