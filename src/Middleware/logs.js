const {activityLog} = require('../Models/activityLog');
const logs = async (user,app,description) => {
	const newLog = new activityLog({
            user: user, // Assuming user is a document with an _id field
            application: app,
            description:description
        });
	await newLog.save();
}

module.exports={logs};
