const moment = require('moment')
const cardano = require('cardano-api')

exports.verify = (req, res) => {   
    let address = req.params.address || ''
    address = address.trim()

    cardano.address({address})
        .then(data =>  {
            console.log(data)
            data = data.Right
            let info = {}
            info.txNum = data.caTxNum
            info.txns = []
            data.caTxList.forEach((tx) => {
                if (info.txns.length >= 2) return;
                let transaction = {}
                transaction.id = tx.ctbId
                let datetime = moment(tx.ctbTimeIssued * 1000)
                transaction.dt = datetime.format('LL')
                info.txns.push(transaction)
            })

            if (info.Left)
                req.flash('errors', {msg: 'Invalid address'})
            else
                req.flash('success', {msg: 'This is a valid ADA address'})

            return res.render('address', {
                address: address,
                data: info
            })
        })
        .catch(err => {
            req.flash('errors', {msg: 'Something went wrong. Please try again later.'})
            return res.render('address', {
                address: address,
                data: {}
            })
        })
}
exports.redirect = (req, res) => {
    return res.redirect('/address/' + req.body.search)
}