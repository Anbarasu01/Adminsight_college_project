// run with: npm run seed
require('dotenv').config();
const connectDB = require('../config/db');
const Department = require('../models/department');
const User = require('../models/User');

(async () => {
  await connectDB();

  // create a collector if not exists
  let collector = await User.findOne({ role: 'collector' });
  if (!collector) {
    collector = await User.create({
      name: 'District Collector',
      email: 'collector@adminsight.local',
      password: 'password123',
      role: 'collector',
      status: 'approved'
    });
    console.log('Collector created:', collector.email);
  } else {
    console.log('Collector already exists');
  }

  const departments = [
    "Revenue & Disaster Management",
    "Health",
    "Education",
    "Agriculture",
    "Police",
    "Rural Development",
    "Public Works (PWD)",
    "Transport",
    "Social Welfare",
    "Electricity & Water"
  ];

  for (const name of departments) {
    let d = await Department.findOne({ name });
    if (!d) {
      // create a head user for each department
      const headEmail = `${name.split(' ')[0].toLowerCase().replace(/[^\w]/g,'')}_head@adminsight.local`;
      const head = await User.create({
        name: `${name} Head`,
        email: headEmail,
        password: 'password123',
        role: 'head',
        departmentName: name,
        status: 'approved'
      });
      d = await Department.create({ name, head: head._id });
      // link user -> department
      head.department = d._id;
      await head.save();
      console.log('Created department & head:', name);
    } else {
      console.log('Department exists:', name);
    }
  }

  console.log('Seeding complete.');
  process.exit(0);
})();
