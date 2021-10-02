const IP_BLOCK_LIST = [
  '34.209.105.222'
]

const URI_BLOCK_LIST = [
  'http://www.uptimerobot.com/'
]

class Blacklister {
  constructor({ headers, connection }){
    this.ipForwarded = headers['x-forwarded-for']
    this.ipReal = headers['x-real-ip']
    this.ipRemote = connection.remoteAddress
    this.uriAddress = this.getUriAddress(headers)
  }

  getUriAddress(headers){
    return headers['user-agent'].split('(')[1].replace(')', '').split('; ')[2]
  }

  isIpBlocked(){
    const uniqueIps = [
      !!this.ipForwarded && this.ipForwarded,
      !!this.ipReal && this.ipReal, 
      !!this.ipRemote && this.ipRemote
    ].filter((v, i, a) => !!v && a.indexOf(v) === i);
    return uniqueIps.every(i => IP_BLOCK_LIST.includes(i));
  }

  isUriBlocked(){
    return URI_BLOCK_LIST.includes(this.uriAddress)
  }
}

module.exports = Blacklister