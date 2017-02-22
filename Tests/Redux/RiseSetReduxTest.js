import test from 'ava'
import Actions, { reducer, INITIAL_STATE } from '../../App/Redux/RiseSetRedux'

test('attempt', t => {
  const state = reducer(INITIAL_STATE, Actions.riseSetRequest('data'))

  t.true(state.fetching)
})

test('success', t => {
  const state = reducer(INITIAL_STATE, Actions.riseSetSuccess('hi'))

  t.is(state.payload, 'hi')
})

test('failure', t => {
  const state = reducer(INITIAL_STATE, Actions.riseSetFailure(99))

  t.false(state.fetching)
  t.true(state.error)
})
