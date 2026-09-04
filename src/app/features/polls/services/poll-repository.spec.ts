import { TestBed } from '@angular/core/testing';

import { SupabaseService } from '../../../core/supabase/supabase';
import { PollRepository } from './poll-repository';

const pollRows = [
  {
    id: 'poll-1',
    category: 'Technology',
    title: 'Test survey',
    question: 'Which option?',
    description: null,
    deadline: null,
    created_at: '2026-09-04T10:00:00Z',
  },
];
const questionRows = [{ id: 'question-1', poll_id: 'poll-1', text: 'Which option?', position: 0, allow_multiple: false }];
const optionRows = [{ id: 'option-1', poll_id: 'poll-1', question_id: 'question-1', text: 'First' }];
const voteRows = [{ option_id: 'option-1' }];

const supabaseStub = {
  client: {
    from: (table: string) => ({
      select: () => selectRows(table),
    }),
  },
};

function selectRows(table: string): unknown {
  if (table === 'polls' || table === 'poll_questions') {
    const data = table === 'polls' ? pollRows : questionRows;
    return { order: async () => ({ data, error: null }) };
  }
  const data = table === 'poll_options' ? optionRows : voteRows;
  return Promise.resolve({ data, error: null });
}

describe('PollRepository', () => {
  let repository: PollRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: SupabaseService, useValue: supabaseStub }],
    });
    repository = TestBed.inject(PollRepository);
  });

  it('loads the complete persisted poll snapshot', async () => {
    await expect(repository.fetchSnapshot()).resolves.toEqual({
      polls: pollRows,
      questions: questionRows,
      options: optionRows,
      votes: voteRows,
    });
  });
});
