const mysql = require('../database/mysql');

const getAllSensorsData = async (req, res) => {
    try{
        const data = await mysql.query('SELECT * FROM sensor_data');
        if(!data){
            return res.status(404).send({
                success:false,
                message:'No Records found'
            })
        }
        res.status(200).send({
            success:true,
            message:'All Sensors Records',
            data : data[0]
        })
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success:false,
            message:'Error in Get All Sensors Data API',
            err
        });
    }
};

module.exports = { getAllSensorsData };