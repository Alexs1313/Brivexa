import React from 'react';

import {FarmProvider} from '../data/FarmContext';
import {FieldsProvider} from '../data/FieldsContext';
import {SavedCalculationsProvider} from '../data/SavedCalculationsContext';
import {TasksProvider} from '../data/TasksContext';
import {FarmToastProvider} from './FarmToastContext';
import {RootNavigator} from './RootNavigator';

export function AppNavigator() {
  return (
    <TasksProvider>
      <FieldsProvider>
        <FarmProvider>
          <SavedCalculationsProvider>
            <FarmToastProvider>
              <RootNavigator />
            </FarmToastProvider>
          </SavedCalculationsProvider>
        </FarmProvider>
      </FieldsProvider>
    </TasksProvider>
  );
}
