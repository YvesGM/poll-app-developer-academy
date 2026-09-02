import { Routes } from '@angular/router';

import { PollList } from './features/polls/pages/poll-list/poll-list';
import { PollCreate } from './features/polls/pages/poll-create/poll-create';
import { PollDetail } from './features/polls/pages/poll-detail/poll-detail';

export const routes: Routes = [
  {
    path: '',
    component: PollList,
  },
  {
    path: 'polls/new',
    component: PollCreate,
  },
  {
    path: 'polls/:id',
    component: PollDetail,
  },
  {
    path: '**',
    redirectTo: '',
  },
];