<template>
    <div>
        <router-link :to="createBtn" v-html="'Написати'" class="btn-create" />
        <vue-good-table
            :columns="columns"
            :rows="rows"
            :pagination-options="paginationOptions"
            styleClass="vgt-table striped"
            :totalRows="totalRows"
            mode="remote"
            @on-page-change="onPageChange"
            @on-sort-change="onSortChange"
            @on-column-filter="onColumnFilter"
            @on-per-page-change="onPerPageChange"
            @on-cell-click="editHandler"
            @on-selected-rows-change="selectionChanged"
            :select-options="checkboxOptions"
            :row-style-class="customStyleHandler"
        >
            <div slot="selected-row-actions" v-if="isCheckbox">
                <button v-html="$t('messages.1020')" class="btn btn-outline-danger rounded-0" @click="destroyHandler" />
            </div>
            <div slot="emptystate" v-html="$t('messages.1306')" class="text-center" />
        </vue-good-table>
    </div>
</template>
<script>
    import {setFieldDeleteDate, setDateType} from '../mutualFunctionality';
    import {paginationOptions, pageChange, sortChange, columnFilter, perPageChange, initialQueryParams} from '../roles/vgt_templates/constants';

    export default {
        props: ['columnsData', 'isCheckbox', 'messagesType'],
        name: 'notification-list',
        data() {
            const columnLabels = {createDate: this.$t('messages.127')};
            return {
                dateFilterFields: [columnLabels.createDate],
                columns: this.columnsData,
                rows: [],
                paginationOptions: paginationOptions(this),
                checkboxOptions: {
                    selectOnCheckboxOnly: true,
                    enabled: this.isCheckbox,
                    selectionText: 'рядків обрано',
                    clearSelectionText: `${this.$t('messages.368')} вибір`
                },
                totalRows: 0,
                currentPerPage: 10,
                filterData: null,
                sorting: [{
                   field: 'id',
                   type: 'desc'
                }],
                urlGet: 'notifications',
                createBtn: {name: 'notify', params: {idUser: 'new'}},
                checkedId: [],
                trashCat: 'trash'
            }
        },
        methods: {
            getData: function (params) {
                let paramData = {
                    queryParams: params,
                    type: this.messagesType
                };
                axios.get(this.urlGet, {params: paramData}).then(resp => {
                    this.rows = resp.data.rows;
                    this.totalRows = resp.data.count;
                    this.changeMessageCount(resp.data.notificationsAmount);
                });
            },
            onPageChange: function (params) { pageChange(params, this) },
            onSortChange: function (params) { sortChange(params, this) },
            onColumnFilter: function (params) { columnFilter(params, this) },
            onPerPageChange: function (params) { perPageChange(params, this) },
            selectionChanged: function (params) {
                this.checkedId = [];
                params.selectedRows.map(row => {
                    if ((this.messagesType === this.trashCat && row.type === 1) || this.messagesType !== this.trashCat) {this.checkedId.push(row.id)};
                });
            },
            editHandler: function (params) {
                params.row.messagesCategory = this.messagesType;
                this.$router.push({
                    name: 'showMessage',
                    params: { 
                        id: params.row.id,
                        rowData: params.row
                    }
                });
            },
            changeMessageCount: function (notificationsAmount) {
                this.$store.commit('setCounters', {
                    type: 'notifications',
                    value: notificationsAmount
                });
            },
            destroyHandler: function () {
                if(this.checkedId.length) {
                    if (this.messagesType === this.trashCat) {
                        axios.delete(`${this.urlGet}/mass`, {params: {messages: this.checkedId}})
                            .then(resp => {
                                if (resp.data.result.length) {
                                    let newCheckedId = this.checkedId.filter(checkId => resp.data.result.indexOf(String(checkId)) < 0);
                                    this.checkedId = newCheckedId;
                                    let messageResp = `Повідомлення ${resp.data.result} не видалено одним з адресантів`; 
                                    this.messageHandler(messageResp, 'info');
                                }
                                this.getData(initialQueryParams(this));
                            });
                    } else {
                        axios.put(`${this.urlGet}/mass`, {
                            messages: this.checkedId,
                            fieldName: setFieldDeleteDate(this.messagesType)
                        }).then(resp => this.getData(initialQueryParams(this)));
                    }
                } else {
                    if (this.messagesType === this.trashCat) {
                        this.messageHandler('Системні файли не можливо видалити', 'info');    
                    } else {
                        this.messageHandler('Нічого не обрано', 'info');
                    }
                }
            },
            messageHandler: function(message, type) {
                let myToast = this.$toasted.show(this.$t('messages.1279'), {type: type});
                myToast.text(message).goAway(2000);
            },
            customStyleHandler: function (row) {
                const defaultClass = 'vgt-custom';
                return (this.messagesType === 'sent' || row.read_date)  ? defaultClass : `${defaultClass} font-weight-bold`;
            }
        },
        updated: function () {
            let startDateFilter = document.querySelectorAll('.filter-th div input');
            const customWidth = false;
            setDateType(startDateFilter, this.dateFilterFields, customWidth);
        },
        created: function () {
            this.getData(initialQueryParams(this));
        }
    }
</script>
