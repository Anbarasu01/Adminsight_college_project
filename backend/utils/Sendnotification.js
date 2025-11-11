const Notification = require("../models/notificationModel");
const User = require("../models/User");
const Department = require("../models/department");

/**
 * Creates notifications for:
 *  - all collectors (role: 'collector')
 *  - department head (if found via Department.head OR User.departmentName)
 *
 * @param {Object} params
 *   - department: string (department name)
 *   - message: string
 *   - data: object (optional payload)
 */
async function sendInAppNotifications({ department, message, data = {} }) {
  try {
    const created = [];

    // notify all collectors
    const collectors = await User.find({
      role: "collector",
      status: "approved",
    }).select("_id");
    const collectorNotifs = collectors.map((c) => ({
      sender: "Public Portal",
      receiverUser: c._id,
      receiverRole: "collector",
      department,
      message,
      data,
    }));

    // try to find head via Department.head
    let headUser = null;
    const deptDoc = await Department.findOne({ name: department }).populate(
      "head"
    );
    if (deptDoc && deptDoc.head) headUser = deptDoc.head;

    // fallback: find a user who has departmentName equal to department and role=head
    if (!headUser) {
      headUser = await User.findOne({
        role: "head",
        departmentName: department,
        status: "approved",
      });
    }

    const headNotifs = headUser
      ? [
          {
            sender: "Public Portal",
            receiverUser: headUser._id,
            receiverRole: "head",
            department,
            message,
            data,
          },
        ]
      : [];

    const all = [...collectorNotifs, ...headNotifs];
    if (all.length > 0) {
      const docs = await Notification.insertMany(all);
      created.push(...docs);
    }

    return { createdCount: created.length };
  } catch (err) {
    console.error("sendInAppNotifications error:", err);
    return { error: err.message };
  }
}

module.exports = sendInAppNotifications;
