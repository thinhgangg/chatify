export const authMe = async (req, res) => {
  try {
    return res.status(200).json({ user: req.user });
  } catch (error) {
    console.error("Error occurred while fetching authenticated user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const test = async (req, res) => {
  return res.sendStatus(204);
};
