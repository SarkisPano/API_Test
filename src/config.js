module.exports = {

    JWT_ACCESSSECRET: process.env.JWT_SECRET || 'test1_login1234',
    JWT_REFRESHSECRET: process.env.JWT_SECRET || 'test_refresh1234',
    JWT_VERIFYSECRET: process.env.JWT_SECRET || 'test_verify1234'
    
};
