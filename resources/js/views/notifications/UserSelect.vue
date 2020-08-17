<template>
	<div class="col-12 d-flex align-items-center">
		<label :for="idName" class="col-form-label no-wrap" :class="{'text-danger': error}">
			<strong v-html="labelStr" />
		</label>
		<multiselect
			:loading="spinFlag"
			v-model="modelHandler"
			:options="optionsData"
			:multiple="false"
			:preserve-search="true"
			label="title"
			track-by="id"
			:showPointer="true"
			@remove="removeHandler(idName)"
			@search-change="searchHandler"
			:selectLabel="$t('messages.1276')"
			:deselectLabel="$t('messages.1277')"
			:id="idName"
			:show-no-results="true"
			:disabled="isDisable"
			placeholder=""
			class="message-header-input ml-2"
		>
			<template slot="singleLabel" slot-scope="{ option }">
				<strong>{{ option.title }}</strong>
				<span class="ml-2">({{ option.desc }})</span>
                <span class="custom__remove ml-2" @click="remove(option)">❌</span>
            </template>
            <template slot="clear" slot-scope="props">
                <div class="multiselect__clear" v-if="modelObj.length" @mousedown.prevent.stop="clearAll(props.search)"></div>
            </template>
            <template slot="option" slot-scope="props">
                <div class="d-flex align-items-center notify-border-bottom">
                    <img class="option__image rounded-circle" :src="props.option.img" alt="avatar">
                    <div class="option__desc ml-2">
                    	<span class="option__title">{{ props.option.title }}</span>
                    	<span class="option__small">({{ props.option.desc }})</span>
                    </div>
                </div>
            </template>
			<span slot="noResult" v-html="$t('messages.517')" />
			<span slot="noOptions" v-html="$t('messages.1305')" />
		</multiselect>
	</div>
</template>
<script>
	import Multiselect from 'vue-multiselect';
	import 'vue-multiselect/dist/vue-multiselect.min.css';

	export default {
		props: ['idName', 'error', 'labelStr', 'modelObj', 'optionsData', 'removeHandler', 'searchHandler', 'isDisable', 'spinFlag'],
		computed: {
			modelHandler: {
				get: function () {
					return this.modelObj;
				},
				set: function (val) {
					this.$emit('update:modelObj', val);
				}
			}
		},
		components: {
			Multiselect
		}
	}
</script>
<style scoped>
	.message-header-input {
		background-color: transparent;
	    outline: unset;
	    width: inherit;
	}
	.no-wrap {
		white-space: nowrap;
	}
	.option__image {
		width: 50px;
		height: 50px;
	}
	.notify-border-bottom {
		border-bottom: 1px solid;
	}
</style>
<style>
	.message-header-input * {
		background-color: transparent;
		border-color: transparent;
	}
	.message-header-input .multiselect__content {
		background-color: #e4e5e6;
	}
</style>