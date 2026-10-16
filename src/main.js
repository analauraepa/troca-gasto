import './style.css'

import './bootstrap.scss';
import 'bootstrap/js/dist/modal';

import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';

library.add(faTrash, faPencil);
dom.watch();
