const moment = require('moment')
const cardano = require('cardano-api')

exports.verify = (req, res) => {   
    let address = req.params.address || ''
    address = address.trim()

    cardano.address({address})
        .then(data =>  {
            let info = {}
            if (data.Left)
                req.flash('errors', {msg: 'Invalid address'})
            else {
                req.flash('success', {msg: 'This is a valid ADA address'})
                data = data.Right
                info.txNum = data.caTxNum
                info.balance = data.caBalance.getCoin
                info.txns = []
                data.caTxList.forEach((tx) => {
                    if (info.txns.length >= 2) return;
                    let transaction = {}
                    transaction.id = tx.ctbId
                    let datetime = moment(tx.ctbTimeIssued * 1000)
                    transaction.dt = datetime.format('LL')
                    transaction.ins = tx.ctbInputSum.getCoin
                    transaction.outs = tx.ctbOutputSum.getCoin
                    console.log(transaction)
                    info.txns.push(transaction)
                })
            }

            return res.render('address', {
                address: address,
                data: info
            })
        })
        .catch(err => {
            console.log(err)
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