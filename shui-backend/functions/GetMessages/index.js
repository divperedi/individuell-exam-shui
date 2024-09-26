const { s3 } = require('../../services/s3');
const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../services/index');

exports.handler = async (event) => {
  try {
    const data = await db.scan({
      TableName: 'messages-db',
      ExpressionsAttributeValues: {
        ':message': 'message',
      },
    })

    return sendResponse(200, {
      messages: data.Items
    });
  } catch (error) {
    return sendError(400, { message: 'Something went wrong' });
  }
};
