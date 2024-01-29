const Supabase = require("../db/supabase.js");

// getMyNotifications,
const getMyNotifications = async (req, res) => {
  const { user_id: recipient_id } = req.headers;
  if (!recipient_id) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  const { data, error } = await Supabase.from("notifications")
    .select("*")
    .eq("recipient_id", recipient_id);
  if (error) {
    res.status(400).json({ error: error.message });
  }

  res.status(200).json(data);
};

// readNotification,
const readNotification = async (req, res) => {
  //   const { user_id: recipient_id } = req.headers;
  const recipient_id = "9cc9210d-4530-40f8-a13d-bd2af6d05801";

  const notification_id = req.params.id;
  const { data: updatedNotification, error } = await Supabase.from(
    "notifications"
  )
    .update({ is_read: true })
    .eq("recipient_id", recipient_id)
    .eq("id", notification_id)
    .select("*");
  if (error) {
    console.log(error.message);
    return res.status(401).json({ error });
  }
  res.status(200).json(updatedNotification);
};

// deleteNotification

const deleteNotification = async (req, res) => {
  const { user_id: recipient_id } = req.headers;
  const notification_id = req.params.id;
  const { data: deletedNotification, error } = await Supabase.from(
    "notifications"
  )
    .delete()
    .eq("recipient_id", recipient_id)
    .eq("id", notification_id)
    .select("*");
  if (error) {
    console.log(error.message);
    return res.status(401).json({ error });
  }
  res.status(200).json(deletedNotification);
};

module.exports = {
  getMyNotifications,
  readNotification,
  deleteNotification,
};
