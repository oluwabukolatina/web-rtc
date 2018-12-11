exports.registerUser =  (req, res, next) => {
	const {email, password} = req.body;

	users.create({
		email,
		password

	}).then((data) => {
		if(!data){
      return next(res.send({
        status : failed,
        message : "can't register user"
      }));}

		res.status(200).json(data);

	})
	.catch(err => {
		err.errors.map(er => {
			res.send({message : er.message, status : "failed"});
		});
	});
	})
}
