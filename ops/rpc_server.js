var rpc = require('jayson/promise')

const config = require('../helpers/configReader.js')

module.exports = function (vorpal) {
    return vorpal.command('rpc server').allowUnknownOptions().description('Runs JSON-RPC server').action(function (args, callback) {
        var self = this

        var methods = {
            accountNew: function (args, done) {
                return new Promise(function (resolve, reject) {
                    var data = vorpal.execSync('account new')
                    var err = null
                    if (data.success === false) {
                        err = server.error(1, data.error)
                        reject(err)
                    } else resolve(data.account);
                })
            },
            clientVersion: function (args) {
                return new Promise(function (resolve, reject) {
                    var cmd = 'client version '
                    var err = null
                    var data = {success: false}
                    data = vorpal.execSync(cmd)
                    resolve(data.version)
                })
            },
            getAddress: function (args) {
                return new Promise(function (resolve, reject) {
                    var cmd = 'get address '
                    var err = null
                    var data = {success: false}
                    if (!args.length || args.length > 1) {
                        err = this.error(-32602)
                        reject(err)
                    } else {

                        cmd += '"' + args[0] + '"'
                        data = vorpal.execSync(cmd)
                        data.then(function (data) {
                            if (data) {
                                if (data.success === false) {
                                    err = server.error(1, data.error)
                                } else {
                                    data = data.account
                                }
                            }
                            if (err)
                                reject(err)
                            else
                                resolve(data)
                        }).catch(function (err) {
                            reject(err)
                        })
                    }
                })
            },
            getBlock: function (args) {
                return new Promise(function (resolve, reject) {
                    var cmd = 'get block '
                    var err = null
                    var data = {success: false}
                    if (!args.length || args.length > 1) {
                        err = this.error(-32602)
                        reject(err)
                    } else {

                        cmd += '"' + args[0] + '"'
                        data = vorpal.execSync(cmd)
                        data.then(function (data) {
                            if (data) {
                                if (data.success === false) {
                                    err = server.error(1, data.error)
                                } else {
                                    data = data.block
                                }
                            }
                            if (err)
                                reject(err)
                            else
                                resolve(data)
                        }).catch(function (err) {
                            reject(err)
                        })
                    }
                })
            },
            getBlocks: function (args) {
                return new Promise(function (resolve, reject) {
                    var cmd = 'get blocks '
                    var err = null
                    var data = {success: false}
                    if (!args.length) {
                        err = this.error(-32602)
                        reject(err)
                    } else {
                        cmd += '"' + args.join(',') + '"'
                        data = vorpal.execSync(cmd)
                        data.then(function (data) {
                            if (data) {
                                if (data.success === false) {
                                    err = server.error(1, data.error)
                                } else {
                                    data = data.blocks
                                }
                            }
                            if (err)
                                reject(err)
                            else
                                resolve(data)
                        }).catch(function (err) {
                            reject(err)
                        })
                    }
                })
            },
            getDelegate: function (args) {
                return new Promise(function (resolve, reject) {
                    var cmd = 'get delegate '
                    var err = null
                    var data = {success: false}
                    if (!args.length || args.length > 1) {
                        err = this.error(-32602)
                        reject(err)
                    } else {

                        cmd += '"' + args[0] + '"'
                        data = vorpal.execSync(cmd)
                        data.then(function (data) {
                            if (data) {
                                if (data.success === false) {
                                    err = server.error(1, data.error)
                                } else {
                                    data = data.delegate
                                }
                            }
                            if (err)
                                reject(err)
                            else
                                resolve(data)
                        }).catch(function (err) {
                            reject(err)
                        })
                    }
                })
            },
            getTransaction: function (args) {
                return new Promise(function (resolve, reject) {
                    var cmd = 'get transaction '
                    var err = null
                    var data = {success: false}
                    if (!args.length || args.length > 1) {
                        err = this.error(-32602)
                        reject(err)
                    } else {
                        cmd += '"' + args[0] + '"'
                        data = vorpal.execSync(cmd)
                        data.then(function (data) {
                            if (data) {
                                if (data.success === false) {
                                    err = server.error(1, data.error)
                                } else {
                                    data = data.transaction
                                }
                            }
                            if (err)
                                reject(err)
                            else
                                resolve(data)
                        }).catch(function (err) {
                            reject(err)
                        })
                    }
                })
            },
            getTransactionsReceivedByAddress: function (args) {
                return new Promise(function (resolve, reject) {
                    var cmd = 'get transactions '
                    var err = null
                    var data = {success: false}
                    if (!args.length || args.length > 1) {
                        err = this.error(-32602)
                        reject(err)
                    } else {
                        cmd += '"recipientId=' + args[0] + ',and:minAmount=1,orderBy=timestamp:desc"'
                        data = vorpal.execSync(cmd)
                        data.then(function (data) {
                            if (data) {
                                if (data.success === false) {
                                    err = server.error(1, data.error)
                                } else {
                                    data = data.transactions
                                }
                            }
                            if (err)
                                reject(err)
                            else
                                resolve(data)
                        }).catch(function (err) {
                            reject(err)
                        })
                    }
                })
            },
            getTransactionsInBlockByHeight: function (args) {
                return new Promise(function (resolve, reject) {
                    var cmd = 'get transactions '
                    var err = null
                    var data = {success: false}
                    if (!args.length || args.length > 1) {
                        err = this.error(-32602)
                        reject(err)
                    } else {
                        cmd += '"fromHeight=' + args[0] + ',and:toHeight=' + args[0] + ',orderBy=timestamp:desc"'
                        data = vorpal.execSync(cmd)
                        data.then(function (data) {
                            if (data) {
                                if (data.success === false) {
                                    err = server.error(1, data.error)
                                } else {
                                    data = data.transactions
                                }
                            }
                            if (err)
                                reject(err)
                            else
                                resolve(data)
                        }).catch(function (err) {
                            reject(err)
                        })
                    }
                })
            },
            getTransactionsInBlockById: function (args) {
                return new Promise(function (resolve, reject) {
                    var cmd = 'get transactions '
                    var err = null
                    var data = {success: false}
                    if (!args.length || args.length > 1) {
                        err = this.error(-32602)
                        reject(err)
                    } else {
                        cmd += '"blockId=' + args[0] + ',orderBy=timestamp:desc"'
                        data = vorpal.execSync(cmd)
                        data.then(function (data) {
                            if (data) {
                                if (data.success === false) {
                                    err = server.error(1, data.error)
                                } else {
                                    data = data.transactions
                                }
                            }
                            if (err)
                                reject(err)
                            else
                                resolve(data)
                        }).catch(function (err) {
                            reject(err)
                        })
                    }
                })
            },
            getTransactions: function (args) {
                return new Promise(function (resolve, reject) {
                    var cmd = 'get transactions '
                    var err = null
                    var data = {success: false}
                    if (!args.length) {
                        err = this.error(-32602)
                        reject(err)
                    } else {
                        cmd += '"' + args.join(',') + '"'
                        data = vorpal.execSync(cmd)
                        data.then(function (data) {
                            if (data) {
                                if (data.success === false) {
                                    err = server.error(1, data.error)
                                } else {
                                    data = data.transactions
                                }
                            }
                            if (err)
                                reject(err)
                            else
                                resolve(data)
                        }).catch(function (err) {
                            reject(err)
                        })
                    }
                })
            },
            nodeHeight: function (args) {
                return new Promise(function (resolve, reject) {
                    var cmd = 'node height '
                    var err = null
                    var data = {success: false}

                    data = vorpal.execSync(cmd)
                    data.then(function (data) {
                        if (data) {
                            if (data.success === false) {
                                err = server.error(1, data.error)
                            } else {
                                data = data.height
                            }
                        }
                        if (err)
                            reject(err)
                        else
                            resolve(data)
                    }).catch(function (err) {
                        reject(err)
                    })

                })
            },
            nodeVersion: function (args) {
                return new Promise(function (resolve, reject) {
                    var cmd = 'node version '
                    var err = null
                    var data = {success: false}

                    data = vorpal.execSync(cmd)
                    data.then(function (data) {
                        if (data) {
                            if (data.success === false) {
                                err = server.error(1, data.error)
                            } else {
                                data = {commit: data.commit, version: data.version}
                            }
                        }
                        if (err)
                            reject(err)
                        else
                            resolve(data)
                    }).catch(function (err) {
                        reject(err)
                    })

                })
            },
            sendTokens: function (args) {
                return new Promise(function (resolve, reject) {
                    var cmd = 'send tokens '
                    var err = null
                    var data = {success: false}
                    if (!args.address || !args.amount) {
                        err = this.error(-32602)
                        reject(err)
                    } else {
                        cmd = cmd + args.address + ' ' + args.amount
                        if (args.passPhrase)
                            cmd += ' --passPhrase "' + args.passPhrase + '"'
                        data = vorpal.execSync(cmd)
                        data.then(function (data) {
                            if (data) {
                                if (data.success === false) {
                                    err = server.error(1, data.error)
                                } else {
                                    data = data.transactionId
                                }
                            }
                            if (err)
                                reject(err)
                            else
                                resolve(data)
                        }).catch(function (err) {
                            reject(err)
                        })
                    }
                })
            }
        }
        var server = rpc.server(methods)
        server.http().listen(config.getRpcConfig().port)
        this.log('JSON-RPC server listening on port ' + config.getRpcConfig().port)

    });
};