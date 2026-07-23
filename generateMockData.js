const fs = require('fs');

const generateData = () => {
  const data = [];
  const roles = ['admin', 'user', 'system', 'manager'];
  const actions = ['DELETE_USER', 'LOGIN', 'LOGOUT', 'UPDATE_PROFILE', 'VIEW_DASHBOARD', 'DOWNLOAD_REPORT'];
  const severities = ['HIGH', 'MEDIUM', 'LOW'];
  const statuses = ['Resolved', 'Unresolved', 'Pending'];
  const regions = ['ap-south-1', 'us-east-1', 'eu-west-1', 'us-west-2'];

  for (let i = 0; i < 10000; i++) {
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
    
    // Create random timestamp within the last 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    data.push({
      actor: `user${i}@company.com`,
      role: randomRole,
      action: actions[Math.floor(Math.random() * actions.length)],
      resource: `/api/resource/${Math.floor(Math.random() * 1000)}`,
      resourceType: 'USER',
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      region: regions[Math.floor(Math.random() * regions.length)],
      severity: randomSeverity,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      timestamp: date.toISOString()
    });
  }

  fs.writeFileSync('mockData10k.json', JSON.stringify(data, null, 2));
  console.log('Successfully generated mockData10k.json with 10,000 records.');
};

generateData();
