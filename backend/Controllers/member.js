const Member = require("../Modals/member");
const Membership = require("../Modals/membership");

exports.getAllMember = async (req, res) => {
  try {
    const { skip, limit } = req.query;
    const members = await Member.find({ gym: req.gym._id });
    const totalMember = members.length;

    const limitedMembers = await Member.find({ gym: req.gym._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.status(200).json({
      message: members.length
        ? "Fetched Members SuccessFully"
        : "No any Member Registered yet",
      members: limitedMembers,
      totalMembers: totalMember,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};

function addMonthsToDate(months, joiningDate) {
  //get current year,month,and day
  let today = joiningDate;
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  //calculate the new month and year
  const futureMonth = currentMonth + months;
  const futureYear = currentYear + Math.floor(futureMonth / 12);

  //calculate the correct future month
  const adjustedMonth = futureMonth % 12;

  //set the date to the first of the future month
  const futureDate = new Date(futureYear, adjustedMonth, 1);

  //get the last day of the future month
  const lastDayOfFutureMonth = new Date(
    futureYear,
    adjustedMonth + 1,
    0
  ).getDate();

  //adjust the day if current day exceeds the number of days in the new month
  const adjustedDay = Math.min(currentDay, lastDayOfFutureMonth);

  //set the final adjusted day
  futureDate.setDate(adjustedDay);

  return futureDate;
}

exports.registerMember = async (req, res) => {
  try {
    const { name, mobileNo, email, address, membership, profilePic, joiningDate, slotTiming } =
      req.body;
    const member = await Member.findOne({ gym: req.gym._id, mobileNo });
    if (member) {
      return res
        .status(409)
        .json({ error: "Already registered with this Mobile No" });
    }

    const memberShip = await Membership.findOne({
      _id: membership,
      gym: req.gym._id,
    });
    const membershipMonth = memberShip.months;
    if (memberShip) {
      let jngDate = new Date(joiningDate);
      const nextBillDate = addMonthsToDate(membershipMonth, jngDate);
      let newmember = new Member({
        name,
        mobileNo,
        email,
        address,
        membership,
        gym: req.gym._id,
        profilePic,
        joiningDate: jngDate,
        lastPayment: jngDate,
        nextBillDate,
        slotTiming,
      });

      await newmember.save();
      res
        .status(200)
        .json({ message: "Member Registered Successfully", newmember });
    } else {
      return res.status(409).json({ error: "No such Membership are there" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.searchMember = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    const member = await Member.find({
      gym: req.gym._id,
      $or: [
        { name: { $regex: "^" + searchTerm, $options: "i" } },
        { mobileNo: { $regex: "^" + searchTerm, $options: "i" } },
      ],
    });
    res.status(200).json({
      message: member.length
        ? "Fetched Members SuccessFully"
        : "No Such Member Registered yet",
      members: member,
      totalMembers: member.length,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.monthlyMember = async (req, res) => {
  try {
    const now = new Date();

    //get the first day of the current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    //get the last day of the current month
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const member = await Member.find({
      gym: req.gym._id,
      createdAt: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: member.length
        ? "Fetched Members SuccessFully"
        : "No Such Member Registered yet",
      members: member,
      totalMembers: member.length,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.expiringWithin3Days = async (req, res) => {
  try {
    const today = new Date();
    const nextThreeDays = new Date();
    nextThreeDays.setDate(today.getDate() + 3);

    const member = await Member.find({
      gym: req.gym._id,
      nextBillDate: {
        $gte: today,
        $lte: nextThreeDays,
      },
    });

    res.status(200).json({
      message: member.length
        ? "Fetched Members SuccessFully"
        : "No Such Member is Expiring within 3 Days",
      members: member,
      totalMembers: member.length,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.expiringWithIn4To7Days = async (req, res) => {
  try {
    const today = new Date();
    const next4Days = new Date();
    next4Days.setDate(today.getDate() + 4);

    const next7Days = new Date();
    next7Days.setDate(today.getDate() + 7);
    const member = await Member.find({
      gym: req.gym._id,
      nextBillDate: {
        $gte: next4Days,
        $lte: next7Days,
      },
    });

    res.status(200).json({
      message: member.length
        ? "Fetched Members SuccessFully"
        : "No Such Member is Expiring within 4-7 Days",
      members: member,
      totalMembers: member.length,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.expiredMember = async (req, res) => {
  try {
    const today = new Date();

    const member = await Member.find({
      gym: req.gym._id,
      status: "Active",
      nextBillDate: {
        $lte: today,
      },
    });

    res.status(200).json({
      message: member.length
        ? "Fetched Members SuccessFully"
        : "No Such Member has been Expired",
      members: member,
      totalMembers: member.length,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.inActiveMember = async (req, res) => {
  try {
    const member = await Member.find({ gym: req.gym._id, status: "Pending" });
    res.status(200).json({
      message: member.length
        ? "Fetched Members SuccessFully"
        : "No Such Member is Pending",
      members: member,
      totalMembers: member.length,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getMemberDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findOne({ _id: id, gym: req.gym._id });
    if (!member) {
      return res.status(400).json({
        error: "No Such Member",
      });
    }

    res.status(200).json({
      message: "Member Data fetched",
      member: member,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const member = await Member.findOne({ _id: id, gym: req.gym._id });
    if (!member) {
      return res.status(400).json({
        error: "No Such Member",
      });
    }
    member.status = status;
    await member.save();
    res.status(200).json({
      message: "Status changed successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.updateMemberPlan = async (req, res) => {
  try {
    const { membership, renewDate } = req.body;
    const { id } = req.params;

    console.log("Update Plan Request:", { id, membership, renewDate });

    if (!membership) {
      return res.status(400).json({ error: "Membership Plan ID is required" });
    }

    const memberShip = await Membership.findOne({
      gym: req.gym._id,
      _id: membership,
    });
    if (memberShip) {
      let getMonth = memberShip.months;
      let startDate = renewDate ? new Date(renewDate) : new Date();

      if (isNaN(startDate.getTime())) {
        return res.status(400).json({ error: "Invalid Date Format" });
      }

      let nextBillDate = addMonthsToDate(getMonth, startDate);
      const member = await Member.findOne({ gym: req.gym._id, _id: id });
      if (!member) {
        return res.status(409).json({ error: "No such Member are there" });
      }
      member.nextBillDate = nextBillDate;
      member.lastPayment = startDate;
      member.joiningDate = startDate; // Update joining date as requested
      member.membership = membership; // Also update the membership reference in case it changed
      member.status = "Active"; // Ensure member is active after renewal

      // Handle legacy members missing slotTiming
      if (!member.slotTiming) {
        member.slotTiming = "Not Set";
      }

      console.log(`Renewing Member: ${id}`);
      console.log(`New Start Date: ${startDate}`);
      console.log(`New Next Bill Date: ${nextBillDate}`);

      await member.save();
      res.status(200).json({ message: "Member Renewed Successfully", member });
    } else {
      return res.status(409).json({ error: "No such Membership are there" });
    }
  } catch (err) {
    console.error("Error in updateMemberPlan:", err);
    res.status(500).json({ error: "Server Error: " + err.message });
  }
};
exports.deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findOneAndDelete({ _id: id, gym: req.gym._id });

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    res.status(200).json({ message: "Member deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};
