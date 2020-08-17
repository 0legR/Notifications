import SysProfile from '../views/profile/SysProfile'
import MainNotify from '../views/notifications/MainNotify'
import Inbox from '../views/notifications/Inbox'
import Sent from '../views/notifications/Sent'
import System from '../views/notifications/System'
import Trash from '../views/notifications/Trash'
import Notify from '../views/notifications/Notify'
import ShowMessage from '../views/notifications/ShowMessage'

// Containers
import Full from '../containers/Full'
// constants
import constants from './constants';

export default
    {
        path: '/general',
        name: 'general',
        redirect: {name: 'notification'},
        component: Full,
        meta: { label: 'Загальне' },
        children: [
            {
                path: '/notification',
                name: 'notification',
                component: MainNotify,
                meta: { label: 'Повідомлення' },
                redirect: { name: 'inbox' },
                children: [
                    {
                        path: 'inbox',
                        name: 'inbox',
                        component: Inbox,
                        meta: { label: 'Вхідні' },
                    },
                    {
                        path: 'sent',
                        name: 'sent',
                        component: Sent,
                        meta: { label: 'Надіслані' },
                    },
                    {
                        path: 'trash',
                        name: 'trash',
                        component: Trash,
                        meta: { label: 'Видалені' },
                    },
                    {
                        path: 'system',
                        name: 'system',
                        component: System,
                        meta: { label: 'Системні' },
                    }
                ]
            },
            {
                path: '/notification/:idUser?',
                name: 'notify',
                component: Notify,
                meta: { label: 'Написати листа' },
                props: (route) => ({...route.params})
            },
            {
                path: '/notification/show/:id',
                name: 'showMessage',
                component: ShowMessage,
                meta: { label: 'Повідомлення' },
                props: (route) => ({...route.params})
            }
        ]
    };
