const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const sqs = new SQSClient();

const producer = async (event) => {
  let statusCode = 200;
  let message;

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "No body was found",
      }),
    };
  }

  try {
    await sqs.send(new SendMessageCommand({
      QueueUrl: process.env.QUEUE_URL,
      MessageBody: event.body,
      MessageAttributes: {
        AttributeName: {
          StringValue: "Attribute Value",
          DataType: "String",
        },
      },
    }));

    message = "Message accepted!";
  } catch (error) {
    console.log(error);
    message = error;
    statusCode = 500;
  }

  return {
    statusCode,
    body: JSON.stringify({
      message,
    }),
  };
};

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

const consumer = async (event) => {
  console.log("evnet.Records: ", event.Records)
  // await delay(15000)
  for (const record of event.Records) {
    console.log("Message Body: ", record.body);
    let statusCode, message
    let inputValue, outputValue

    if (record.body) {
      let body = JSON.parse(record.body)
      if (!(typeof body.input === 'number')) {
        statusCode = 400;
        message = 'input 값이 숫자가 아닙니다.'
      }
      else {
        inputValue = parseInt(body.input)
        outputValue = inputValue + 1
        statusCode = 200;
        message = `메시지를 받았습니다. 입력값: ${inputValue}, 결과: ${outputValue}`
      }
    }
    console.log("statusCode: ", statusCode)
    console.log("message: ", message)
    return {
      statusCode: statusCode,
      body: JSON.stringify(
        {
          message
        },
        null,
        2
      ),
    };
  }
};

module.exports = {
  producer,
  consumer,
};
