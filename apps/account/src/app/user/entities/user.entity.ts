import { AccountChangedCourse } from '@purple/contracts';
import {
  IDomainEvent,
  IUser,
  IUserCourses,
  PurchaseState,
  UserRole,
} from '@purple/interfaces';
import { compare, genSalt, hash } from 'bcryptjs';

export class UserEntity implements IUser {
  _id?: string;
  displayName?: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  courses?: IUserCourses[];
  events: IDomainEvent[] = [];

  constructor(user: IUser) {
    this._id = user._id;
    this.passwordHash = user.passwordHash;
    this.displayName = user.displayName;
    this.email = user.email;
    this.role = user.role;
    this.courses = user.courses;
  }

  public setCourseStatus(courseId: string, state: PurchaseState) {
    const courseExists = this.courses.find(
      (item) => item.courseId === courseId
    );
    if (!courseExists) {
      this.courses.push({
        courseId,
        purchaseState: PurchaseState.Started,
      });
      return this;
    }

    if (state === PurchaseState.Canceled) {
      this.courses = this.courses.filter((item) => item.courseId !== courseId);
      return this;
    }

    this.courses = this.courses.map((item) => {
      if (item.courseId == courseId) {
        item.purchaseState = state;
        return item;
      }
      return item;
    });
    this.events.push({
      topic: AccountChangedCourse.topic,
      data: { courseId, userid: this._id, state },
    });
    return this;
  }

  public async setPassword(password: string) {
    const salt = await genSalt(10);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  public validatePassword(password: string) {
    return compare(password, this.passwordHash);
  }

  public updateProfile(displayName: string) {
    this.displayName = displayName;
    return this;
  }

  public getPublicProfile() {
    return {
      email: this.email,
      role: this.role,
      displayName: this.displayName,
    };
  }
}
