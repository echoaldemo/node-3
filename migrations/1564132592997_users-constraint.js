exports.constraint = "unique_email";

exports.up = (pgm) => {
    pgm.addConstraint('users', exports.constraint, {
        unique: "email"
    });
};

exports.down = (pgm) => {

};
