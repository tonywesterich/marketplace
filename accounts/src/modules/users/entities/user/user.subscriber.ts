import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent
} from 'typeorm';
import { User } from './';
import * as bcrypt from 'bcrypt';

const ENCRYPTION_SALTS = 10;

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    const { password } = event.entity;
    event.entity.password = await bcrypt.hash(password, ENCRYPTION_SALTS);
  }

  async beforeUpdate(event: UpdateEvent<User>) {
    if (event?.entity?.password) {
      const { password } = event.entity;
      event.entity.password = await bcrypt.hash(password, ENCRYPTION_SALTS);
    }
  }
}
