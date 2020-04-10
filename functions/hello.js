exports.handler = async event => {
    const subject = event.queryStringParameters.name || 'World'
    return {
        statusCode: 200,
        body: `Hola ${process.env.NODE_ENV}!`,
    }
}