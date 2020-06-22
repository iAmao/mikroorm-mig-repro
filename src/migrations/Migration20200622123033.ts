import { Migration } from 'mikro-orm';

export class Migration20200622123033 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "test" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" varchar(255) not null);');
  }

}
