import { Routes } from '@angular/router';

import { PollDetail } from './features/polls/pages/poll-detail/poll-detail';
import { PollList } from './features/polls/pages/poll-list/poll-list';

export const routes: Routes = [
  {
    path: '',
    component: PollList,
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
