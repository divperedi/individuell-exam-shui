const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../services/index');

exports.handler = async (event) => {
  const messageBody = JSON.parse(event.body);
  const { username, id } = event.pathParameters;

  console.log('username:', username);
  console.log('id:', id);

  try {
    const data = await db.get({
      TableName: 'messages-db',
      Key: {
        username: username,
        id: id,
      },
    });

    const updatedMessage = messageBody.updatedMessage;

    await db.update({
      TableName: 'messages-db',
      Key: {
        username: username,
        id: id,
      },
      UpdateExpression: 'SET message = :m',
      ExpressionAttributeValues: {
        ':m': updatedMessage,
      },
    });

    return sendResponse(200, {
      message: 'Update successful'
    });
  } catch (error) {
    console.error(error);
    return sendError(400, { message: 'Something went wrong' });
  }
};