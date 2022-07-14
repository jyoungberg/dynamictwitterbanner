const TwitterApi = require('twitter-api-v2').TwitterApi;
const Airtable = require('airtable');
const axios = require('axios');

const getBanner = () => {
    const base = new Airtable({ apiKey: process.env.apiKey }).base(process.env.baseKey);
    return new Promise((resolve, reject) => {
        base('Newest Twitter Banner')
            .select({ view: "Full view" })
            .firstPage((error, records) => {
                if (error) {
                    console.log(error);
                }
                resolve(records[0].fields);
            });
    });
};

exports.handler = async () => {
    const client = new TwitterApi({
        appKey: process.env.appKey,
        appSecret: process.env.appSecret,
        accessToken: process.env.accessToken,
        accessSecret: process.env.accessSecret
    });

    const banner = await getBanner();

    // get the remote image as binary buffer
    console.log(banner['Twitter Banner URL']);
    const response = await axios(`${banner['Twitter Banner URL']}`, { responseType: 'arraybuffer' });

    // upload from the response
    const res = await client.v1.updateAccountProfileBanner(response.data, { width: 1500, height: 500, offset_left: 0 });
    console.log("upload result", res);

    return { statusCode: 200, body: `${banner['Twitter Banner URL']}` };
}