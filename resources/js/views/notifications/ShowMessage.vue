<template>
	<div v-if="rowData">
		<button v-html="$t('messages.501')" class="btn btn-outline-secondary rounded-0 mb-2" @click="backOffHandler" />
		<message-body
			:rowData="rowData"
			:destroyHandler="destroyHandler"
		/>
		<message-body
			v-for="(message, key) in diaglogList"
			:key="key"
			:rowData="message"
			:messagesCategory="'Dialog'"
			:destroyHandler="destroyHandler"
		/>
	</div>
</template>
<script>
	import MessageBody from './MessageBody';
	import {setFieldDeleteDate, errorHandler} from '../mutualFunctionality'

	export default {
		props: ['rowData', 'id'],
		data: function () {
			return {
				diaglogList: [],
				urlGet: 'notifications'
			}
		},
		created: function () {
			if(!this.rowData) {
				this.backOffHandler();
			} else {
				this.messageDialog();
			}
		},
		methods: {
			backOffHandler: function () {
                this.$router.go(-1);
            },
            messageDialog: function () {
                axios.get(`${this.urlGet}/${this.id}`).then(resp => {
                	this.diaglogList = resp.data.messages.filter(message => message.id !== this.id);
                	const isInboxUnread = this.rowData.messagesCategory === 'inbox' && !this.rowData.read_date;
                	const isSustemUnread = this.rowData.messagesCategory === 'system' && !this.rowData.read_date;
                	if (isInboxUnread || isSustemUnread) {
	                	this.changeMessageCount();
	                }
                });
            },
            removeDeletedRows: function (id) {
	            this.changeMessageCount();
            	if (this.id === id) {
            		this.backOffHandler();
            	} else {
                    let newRows = this.diaglogList.filter(message => message.id !== id);
                    this.diaglogList = newRows;
                }
                this.messageHandler('Повідомлення видалено', 'success');
            },
            changeMessageCount: function () {
            	if (this.rowData.messagesCategory !== 'trash') {
	                const counterVal = this.$store.state.counters.notifications - 1;
	                this.$store.commit('setCounters', {
	                    type: 'notifications',
	                    value: counterVal > 0 ? counterVal : 0
	                });
	            }
            },
            destroyHandler: function (id) {
            	if (this.rowData.messagesCategory === 'trash') {
                    axios.delete(`${this.urlGet}/${id}`)
                    	.then(resp => this.removeDeletedRows(id))
                    	.catch(error => this.errorParser(error));;
                } else {
                    axios.put(`${this.urlGet}/${id}`, {fieldName: setFieldDeleteDate(this.rowData.messagesCategory)})
                    	.then(resp => this.removeDeletedRows(id))
                    	.catch(error => this.errorParser(error));
                }
            },
            messageHandler: function(message, type) {
                let myToast = this.$toasted.show(this.$t('messages.1279'), {type: type});
                myToast.text(message).goAway(2000);
            },
            errorParser: function (error) {
                errorHandler(error, this.messageHandler, this.$t('messages.1107'), Vue, this.errors);
            }
		},
		components: {
			MessageBody
		}
	}
</script>
