module.exports = {
    epochTime: new Date(Date.UTC(2017, 8, 2, 17, 0, 0, 0)),
    fees: {
	send: 50000000,
	vote: 1000000000,
	secondsignature: 500000000,
	delegate: 30000000000,
	multisignature: 500000000,
	dapp: 2500000000,
        old_chat_message: 500000,
	chat_message: 100000,
	profile_update:  5000000,
	avatar_upload: 10000000
    },
    transactionTypes: {
	SEND: 0,
	SIGNATURE: 1,
	DELEGATE: 2,
	VOTE: 3,
	MULTI: 4,
	DAPP: 5,
	IN_TRANSFER: 6,
	OUT_TRANSFER: 7,
	CHAT_MESSAGE: 8
    },
    maxVotesPerTransaction: 33
}