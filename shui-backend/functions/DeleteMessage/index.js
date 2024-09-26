const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../services/index');

exports.handler = async (event) => {
  const { username, id } = event.pathParameters;

  try {
    await db.delete({
      TableName: 'messages-db',
      Key: {
        username: username,
        id: id
      },
    });

    return sendResponse(200, {
      message: 'Delete successful'
    });
  } catch (error) {
    console.error(error); 
    return sendError(400, { message: 'Something went wrong' });
  }
};
