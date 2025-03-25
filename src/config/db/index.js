const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(`mongodb+srv://nguyenb2105553:${process.env.PASSWORD}@cluster0.otj1x.mongodb.net/project_react?retryWrites=true&w=majority&appName=Cluster0`);
        // console.log('Connect successfully!!!');
    } catch (error) {
        // console.log('Connect failure!!!');
    }
}
module.exports = { connect };