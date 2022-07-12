const TwitterApi = require('twitter-api-v2').TwitterApi;
const Airtable = require('airtable');
const axios = require('axios');

const getBanner = () => {
    const base = new Airtable({ apiKey: 'keymhJ3fBNpHYVzY1' }).base('apptAJBHpY9GrSirU');
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
        appKey: 'zxJl83huxKutwnNJCLa3mHsGa',
        appSecret: 'BM7AS4nzsHAXZoVtzIQgI0MVGzxHpgdhcOK67oetKdN9OZ8HaQ',
        accessToken: '1545808754314465280-bNtULsr787BlIks0yNevmoLIbepgMx',
        accessSecret: 'mh33RwVGEKmrCjijYg2Qj8A84pbJonC5Cm5U0CtWtHZj7'
    });

    const banner = await getBanner();

    // get the remote image as binary buffer
    console.log(banner['Generated Twitter Banner']);
    const response = await axios(`${banner['Generated Twitter Banner']}`, { responseType: 'arraybuffer' });

    // upload from the response
    const res = await client.v1.updateAccountProfileBanner(response.data, { width: 1500, height: 500, offset_left: 0 });
    console.log("upload result", res);

    return { statusCode: 200, body: `${banner['Generated Twitter Banner']}` };
}