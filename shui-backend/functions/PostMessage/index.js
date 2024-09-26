const { s3 } = require('../../services/s3');
const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../services/index');
const { v4: uuidv4 } = require('uuid');
const { format, addHours } = require('date-fns');

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  console.log(body);

  const { message, username } = body;

  if (!message || !username) {
    return sendError(400, { message: 'Missing required fields' });
  }

  try {
    const now = new Date();
    const adjustedTime = addHours(now, 2);

    await db.put({
      TableName: 'messages-db',
      Item: {
        id: uuidv4().substring(0, 5),
        message: message,
        username: username,
        createdAt: format(adjustedTime, 'yyyy-MM-dd HH:mm:ss')
      }
    });
    console.log(event);
    return sendResponse(200, {
      success: true,
      message: 'Message added successfully'
    });
  } catch (error) {
    console.error('Error:', error);
    return sendError(500, { message: 'An internal server error occurred' });
  }
};
