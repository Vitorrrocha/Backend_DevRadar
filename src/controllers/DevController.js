const axios = require('axios');
const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {

    async index(req,res) {
        const devs = await Dev.find();

        return res.json(devs); 
    },

    async store(req, res) {
        const { github_username, techs, latitude, longitude } = req.body;

        let dev = await Dev.findOne({ github_username });

        if(!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

            const { name = login, avatar_url, bio } = apiResponse.data;

            const techsArray = parseStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            });
        }

        return res.json(dev);
        },

    async update(req, resp) {
        const {
            github_username,
            name,
            bio,
            techs,
            latitude,
            longitude
        } = req.body;

        const techsArray = parseStringAsArray(techs);

        const result = await Dev.updateOne(
            {
            github_username
            },
            {
            $set: {
                name,
                bio,
                techs: techsArray,
                latitude,
                longitude
            }
        });
        return resp.json(result);
    },

    async destroy(req, res){
        const { github_username } = req.body;


        let dev = await Dev.findOneAndDelete({
            github_username
        });
        return res.json({ message: 'deletado com sucesso' });

    }
}