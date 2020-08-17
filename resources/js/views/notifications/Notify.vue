<template>
	<form class="p-3">
		<div class="form-group row border-bottom-message" :class="{'border-danger': errors.receiver}">
			<user-select
				idName="receiver"
				:error="errors.receiver"
				:labelStr="$t('messages.539')"
				:modelObj.sync="receiverHandler"
				:optionsData="receiverOptions"
				:removeHandler="removeUserHandler"
				:searchHandler="searchReceiverHandler"
				:isDisable="isHideReceiver"
				:spinFlag="isSpinReceiver"
			/>
			<div class="text-danger input-error error-position" v-if="errors.receiver" v-html="errors.receiver"/>
		</div>
		<div class="form-group row border-bottom-message" :class="{'border-danger': errors.subject}">
			<div class="col-12 d-flex">
				<label for="subject" class="col-form-label no-wrap" :class="{'text-danger': errors.subject}">
					<strong v-html="`${$t('messages.130')}&colon;`" />
				</label>
				<input
					type="text"
					class="form-control-plaintext message-header-input ml-2"
					id="subject"
					v-model="subjectHandler"
					:disabled="disableSubject"
				/>
			</div>
			<div class="text-danger input-error error-position" v-if="errors.subject" v-html="errors.subject"/>
		</div>
		<div class="form-group row border-bottom-message" :class="{'border-danger': errors.sender}">
			<user-select
				idName="sender"
				:error="errors.sender"
				:labelStr="'Від кого&colon;'"
				:modelObj.sync="senderHandler"
				:optionsData="senderOptions"
				:removeHandler="removeUserHandler"
				:searchHandler="searchSenderHandler"
				:isDisable="isHideSender"
				:spinFlag="isSpinSender"
			/>
			<div class="text-danger input-error error-position" v-if="errors.sender" v-html="errors.sender"/>
		</div>
		<div class="form-group row">
			<div class="col-12">
				<div class="text-danger input-error error-position" v-if="errors.message_text" v-html="errors.message_text"/>
				<textarea type="text" class="form-control" v-model="messageTextHandler" />
			</div>
		</div>
		<div class="d-flex justify-content-end">
			<button
				type="button"
				v-html="'Написати'"
				class="btn btn-outline-primary"
				@click="submitHandler"
			/>
			<button
				type="button"
				v-html="$t(`messages.501`)"
				class="btn btn-outline-secondary ml-2"
				@click="backOffHandler"
			/>
		</div>
	</form>
</template>
<script>
	import UserSelect from './UserSelect';
	import {errorHandler, userAvatartUrl} from '../mutualFunctionality';
	import {isEmptyToError, isDigitBetweenAmount, errorMessages, checkIsReady} from '../roles/form_templates/Validator';

	export default {
		props: ['idUser', 'messageData', 'type', 'disableSubject'],
		data: function () {
			return {
				someData: {
					receiver: '',
					sender: '',
					subject: '',
					message_text: ''
				},
				errorMessages: errorMessages(this),
                errors: {},
                isSpinReceiver: false,
                isSpinSender: false,
                receiverOptions: [],
                senderOptions: [],
                debounceTimer: null,
				doneTypingInterval: 1000,
				isReadyToSend: false
			}
		},
		methods: {
			checkIsReadyToSend: function () {
				let fields = this.type === 'new'  ? [ 'receiver', 'message_text' ] : [ 'receiver', 'sender', 'message_text' ];
				checkIsReady(this, fields);
			},
			submitHandler: function () {
				this.checkIsReadyToSend();
				if (this.isReadyToSend) {
                    const url = `notifications`;
                        axios.post(url, {message: this.prepareToSend()})
                            .then(response => this.successResponse())
                            .catch(error => this.errorParser(error));
                } else {
                    this.messageHandler(this.$t('messages.538'), 'info');
                }
			},
			prepareToSend: function () {
				let message = {...this.someData};
				message.sender = message.sender.id;
				message.receiver = message.receiver.id;
				message.subject = message.subject.length ? message.subject : 'Без теми';
				if (this.type === 'replay') {
					message.parent_id = this.messageData.parent_id;
				}
				return message;
			},
			errorParser: function (error) {
                errorHandler(error, this.messageHandler, this.$t('messages.1107'), Vue, this.errors);
                this.$forceUpdate();
            },
            messageHandler: function(message, type) {
                let myToast = this.$toasted.show(this.$t('messages.1279'), {type: type});
                myToast.text(message).goAway(2000);
            },
            successResponse: function () {
                this.errors = {};
                this.messageHandler(this.$t('messages.770'), 'success');
                this.backOffHandler();
            },
            removeUserHandler: function (type) {
				this.someData[type] = '';
			},
			getUser: function (params, type) {
				axios.get('getUsers', {params: {queryParams: params}}).then(response => {
                        this[type] = this.setOptions(response.data);
                        this.isSpin = false;
                    });
			},
			backOffHandler: function () {
                this.$router.go(-1);
            },
			searchReceiverHandler: function (val) {
				this.searchHandler(val, 'receiverOptions');
			},
			searchSenderHandler: function (val) {
				this.searchHandler(val, 'senderOptions');
			},
			searchHandler: function (val, type) {
				if (val.match(/^\s*$/)) {    // prevent white space requests
                    return;
                }
                this.isSpin = true;
                clearTimeout(this.debounceTimer);
                this.debounceTimer = setTimeout(() => this.getUser(val, type), this.doneTypingInterval);
			},
			setOptions: function (data) {
                let opt = [];
                data.map(item => {
                    opt.push(this.singleOption(item));
                });
                return opt;
            },
            singleOption: function (item) {
            	let name = item.firstName ? `${item.firstName}` : '';
            	name = name.concat(item.middleName ? ` ${item.middleName}` : '');
            	name = name.concat(item.secondName ? ` ${item.secondName}` : '');
            	return {
                    title: item.email,
                    desc: name,
                    img: userAvatartUrl(item.avatar),
                    id: item.id
                };
            }
		},
		computed: {
			subjectHandler: {
				get: function () {
					return this.someData.subject;
				},
				set: function (val) {
					this.someData.subject = val;
				}
			},
			receiverHandler: {
				get: function () {
					return this.someData.receiver;
				},
				set: function (val) {
					this.someData.receiver = val;
					delete this.errors.receiver;	
				}
			},
			senderHandler: {
				get: function () {
					if (this.idUser === 'new' && this.$store.state.user) {
						this.someData.sender = this.singleOption(this.$store.state.user);
					}
					return this.someData.sender;
				},
				set: function (val) {
					this.someData.sender = val;
					delete this.errors.sender;	
				}
			},
			messageTextHandler: {
				get: function () {
					return this.someData.message_text;
				},
				set: function (val) {
					this.someData.message_text = val;
					delete this.errors.message_text;	
				}
			},
			isHideReceiver: function () {
				if (this.idUser) {
					return this.idUser !== 'new';	
				}
				return this.type === 'replay' || this.type !== 'forward';
			},
			isHideSender: function () {
				return (this.idUser && this.idUser === 'new') || this.type === 'replay' || this.type === 'forward';
			},
		},
		created: function () {
			if (this.type === 'replay' || this.type === 'forward') {
				this.someData.message_text = this.messageData.message_text;
				this.someData.subject = this.messageData.subject;
			}
			if (this.type === 'replay') {
				this.someData.receiver = this.singleOption(this.messageData.user_sender);
				this.someData.sender = this.singleOption(this.messageData.user_receiver);
			}
			if (this.type === 'forward') {
				this.someData.sender = this.singleOption(this.messageData.user_receiver);
			}
		},
		components: {
			UserSelect
		}
	}
</script>
<style scoped>
	.message-header-input {
		background-color: transparent;
	    outline: unset;
	    width: inherit;
	}
	.border-bottom-message {
		border-bottom: 1px solid;
	}
	.no-wrap {
		white-space: nowrap;
	}
	textarea {
		height: 40vh;
	}
</style>
