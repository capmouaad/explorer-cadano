const cardano = require('cardano-api')

exports.verify = (req, res) => {   
    let address = req.params.address || ''
    address = address.trim()

    cardano.address({address})
        .then(info =>  {
            console.log(info)
            if (info.Left)
                req.flash('errors', {msg: 'Invalid address'})
            else
                req.flash('success', {msg: 'This is green valid address'})

            return res.render('address', {
                address: address,
                data: info
            })
        })
        .catch(err => console.log('err', err))
}
exports.redirect = (req, res) => {
    return res.redirect('/address/' + req.body.search)
}