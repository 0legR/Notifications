<template>
	<div class="row mb-2">
		<div class="col-12 p-2" :class="[messagesCategory ? 'bg-light': 'bg-white']">
			<div class="d-flex flex-column col-12">
				<ul class="list-group list-group-flush">
					<li class="list-group-item  d-flex justify-content-between align-items-center">
						<div>
							<strong v-html="'Від кого&colon;'" />
							<a :href="`/profile/${rowData.user_sender.id}`" target="_blank">
								<img :src="avaHandler('user_sender')" alt="avatar" class="avata-r" />
								<strong v-html="rowData.user_sender.title" />
							</a>
						</div>
						<div class="d-flex align-items-center">
							<strong v-html="`${$t('messages.994')}&colon;`" class="mr-2" />
							<span v-html="rowData.messagesCategory || messagesCategory" class="mr-3" />
							<strong v-html="`${$t('messages.127')}&colon;`" class="mr-2" />
							<date-column :dateTime="rowData.create_date" />
							<a
								data-toggle="collapse"
								:href="`#replay_${rowData.id}`"
								role="button"
								aria-expanded="false"
								aria-controls="collapseReply"
								class="ml-3"
								v-if="rowData.messagesCategory === 'inbox'"
							>
								<i class="fa fa-mail-reply fa-fw "/>
							</a>
							<a
								data-toggle="collapse"
								:href="`#forward_${rowData.id}`"
								role="button"
								aria-expanded="false"
								aria-controls="collapseForward"
								class="mx-1"
								v-if="rowData.messagesCategory === 'inbox' || rowData.messagesCategory === 'system'"
							>
								<i class="fa fa-mail-forward fa-fw" />
							</a>
							<i
								class="fa fa-trash fa-fw text-danger"
								@click="destroyHandler(rowData.id)"
								v-if="rowData.type === 1 || rowData.messagesCategory === 'system'"
							/>
						</div>	
					</li>
					<li class="list-group-item">
						<strong v-html="$t('messages.539')" />
						<a :href="`/profile/${rowData.user_receiver.id}`" target="_blank">
							<img :src="avaHandler('user_receiver')" alt="avatar" class="avata-r" />
							<strong v-html="rowData.user_receiver.title" />
						</a>		
					</li>
					<li class="list-group-item">
						<strong v-html="`${$t('messages.130')}&colon;`" />
						<a
							data-toggle="collapse"
							:href="`#message_${rowData.id}`"
							role="button"
							aria-expanded="false"
							aria-controls="collapseMessage"
							v-html="rowData.subject"
						/>		
					</li>
				</ul>
			</div>
		</div>
		<div class="collapse col-12 px-0" :id="`message_${rowData.id}`">
			<div class="card card-body" v-html="rowData.message_text" />
		</div>
		<div class="collapse col-12 px-0" :id="`replay_${rowData.id}`">
			<notify :messageData="rowData" type="replay" />
		</div>
		<div class="collapse col-12 px-0" :id="`forward_${rowData.id}`">
			<notify :messageData="rowData" type="forward" />
		</div>
	</div>
</template>
<script>
	import DateColumn from '../roles/vgt_templates/DateColumn';
	import Notify from './Notify';
	import {userAvatartUrl} from '../mutualFunctionality';

	export default {
		props: ['rowData', 'messagesCategory', 'destroyHandler'],
		methods: {
			avaHandler: function (type) {
				return userAvatartUrl(this.rowData[type].avatar);
			},
			replyHandler: function () {

			},
			forwardHandler: function () {

			}
		},
		components: {
			DateColumn,
			Notify
		}
	}
</script>
<style scoped>
	.avata-r {
		width: 36px;
		height: 36px;
		border-radius: 50%;
	}
	.fa {
		cursor: pointer;
	}
</style>