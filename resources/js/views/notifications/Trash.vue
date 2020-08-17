<template>
    <div>
        <list :columnsData="columns" :isCheckbox="true" messagesType="trash" />
    </div>
</template>
<script>
    import List from './List';
    import {dateInputFormat, dateOutputFormat} from '../roles/vgt_templates/constants';
    
    export default {
        name: 'trash-list',
        data() {
            const columnLabels = {createDate: this.$t('messages.127')};
            return {
                dateFilterFields: [columnLabels.createDate],
                columns: [
                    {
                        label: 'Від кого',
                        field: 'user_sender.title',
                        type: 'text',
                        sortable: true,
                        filterOptions: {
                            enabled: true, // enable filter for this column
                            placeholder: this.$t('messages.1281'),// placeholder for filter input
                        }
                    },
                    {
                        label: this.$t('messages.130'),
                        field: 'subject',
                        type: 'text',
                        sortable: false,
                        filterOptions: {
                            enabled: true, // enable filter for this column
                            placeholder: this.$t('messages.1281'),// placeholder for filter input
                        }
                    },
                    {
                        label: columnLabels.createDate,
                        field: 'create_date',
                        type: 'date',
                        dateInputFormat: dateInputFormat,
                        dateOutputFormat: dateOutputFormat,
                        sortable: true,
                        filterOptions: {
                            enabled: true, // enable filter for this column
                            placeholder: columnLabels.createDate
                        }
                    }
                ],
            }
        },
        components: {
            List
        }
    }
</script>
