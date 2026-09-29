import type { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1700000000000 implements MigrationInterface {
  name = 'Init1700000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "animals_animal_type_enum" AS ENUM ('unique', 'extinct', 'rare')`,
    )
    await queryRunner.query(
      `CREATE TYPE "animals_animal_environment_enum" AS ENUM ('ampibian', 'aquatic', 'desert', 'forest', 'grassland', 'mountain', 'polar', 'savanna', 'tundra', 'other')`,
    )
    await queryRunner.query(
      `CREATE TYPE "animals_animal_origin_enum" AS ENUM ('africa', 'asia', 'australia', 'europe', 'north america', 'south america', 'other')`,
    )
    await queryRunner.query(
      `CREATE TYPE "animals_order_name_enum" AS ENUM ('carnivore', 'herbivore', 'omnivore', 'insectivore', 'other')`,
    )
    await queryRunner.query(
      `CREATE TYPE "questions_correct_answer_enum" AS ENUM ('option_1', 'option_2', 'option_3')`,
    )
    await queryRunner.query(
      `CREATE TYPE "quiz_details_selected_option_enum" AS ENUM ('option_1', 'option_2', 'option_3', 'timeout')`,
    )

    await queryRunner.query(`
      CREATE TABLE "accounts" (
        "account_id" uuid NOT NULL,
        "email" varchar(255),
        "password" varchar(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_accounts_email" UNIQUE ("email"),
        CONSTRAINT "PK_accounts" PRIMARY KEY ("account_id")
      )
    `)

    await queryRunner.query(`
      CREATE TABLE "users" (
        "user_id" uuid NOT NULL,
        "account_id" uuid NOT NULL,
        "username" varchar(255),
        "first_name" varchar(255),
        "last_name" varchar(255),
        "bio" text,
        "address" varchar(255),
        "phone" varchar(255),
        CONSTRAINT "UQ_users_username" UNIQUE ("username"),
        CONSTRAINT "PK_users" PRIMARY KEY ("user_id"),
        CONSTRAINT "FK_users_account" FOREIGN KEY ("account_id")
          REFERENCES "accounts"("account_id") ON DELETE CASCADE
      )
    `)

    await queryRunner.query(`
      CREATE TABLE "animals" (
        "animal_id" SERIAL NOT NULL,
        "animal_name" varchar(255) NOT NULL,
        "animal_type" "animals_animal_type_enum" NOT NULL,
        "animal_environment" "animals_animal_environment_enum" NOT NULL,
        "animal_origin" "animals_animal_origin_enum" NOT NULL,
        "latin_name" varchar(255) NOT NULL DEFAULT '',
        "family_name" varchar(255) NOT NULL DEFAULT '',
        "order_name" "animals_order_name_enum",
        CONSTRAINT "PK_animals" PRIMARY KEY ("animal_id")
      )
    `)

    await queryRunner.query(`
      CREATE TABLE "descriptions" (
        "description_id" SERIAL NOT NULL,
        "animal_id" integer NOT NULL,
        "title" varchar(255),
        "description" text,
        "image" varchar(255),
        "fun_fact" text,
        CONSTRAINT "PK_descriptions" PRIMARY KEY ("description_id"),
        CONSTRAINT "FK_descriptions_animal" FOREIGN KEY ("animal_id")
          REFERENCES "animals"("animal_id") ON DELETE CASCADE
      )
    `)

    await queryRunner.query(`
      CREATE TABLE "questions" (
        "question_id" uuid NOT NULL,
        "animal_id" integer NOT NULL,
        "question" text NOT NULL,
        "option_1" varchar(2048) NOT NULL,
        "option_2" varchar(2048) NOT NULL,
        "option_3" varchar(2048) NOT NULL,
        "correct_answer" "questions_correct_answer_enum",
        CONSTRAINT "PK_questions" PRIMARY KEY ("question_id"),
        CONSTRAINT "FK_questions_animal" FOREIGN KEY ("animal_id")
          REFERENCES "animals"("animal_id") ON DELETE CASCADE
      )
    `)

    await queryRunner.query(`
      CREATE TABLE "quizzes" (
        "quiz_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "animal_id" integer NOT NULL,
        "score" integer NOT NULL DEFAULT 0,
        "time" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_quizzes" PRIMARY KEY ("quiz_id"),
        CONSTRAINT "FK_quizzes_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("user_id") ON DELETE CASCADE,
        CONSTRAINT "FK_quizzes_animal" FOREIGN KEY ("animal_id")
          REFERENCES "animals"("animal_id") ON DELETE CASCADE
      )
    `)

    await queryRunner.query(`
      CREATE TABLE "quiz_details" (
        "detail_id" uuid NOT NULL,
        "quiz_id" uuid NOT NULL,
        "question_id" uuid NOT NULL,
        "selected_option" "quiz_details_selected_option_enum" NOT NULL,
        "response_time" integer,
        "is_correct" boolean,
        CONSTRAINT "PK_quiz_details" PRIMARY KEY ("detail_id"),
        CONSTRAINT "FK_quiz_details_quiz" FOREIGN KEY ("quiz_id")
          REFERENCES "quizzes"("quiz_id") ON DELETE CASCADE,
        CONSTRAINT "FK_quiz_details_question" FOREIGN KEY ("question_id")
          REFERENCES "questions"("question_id") ON DELETE CASCADE
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "quiz_details"`)
    await queryRunner.query(`DROP TABLE "quizzes"`)
    await queryRunner.query(`DROP TABLE "questions"`)
    await queryRunner.query(`DROP TABLE "descriptions"`)
    await queryRunner.query(`DROP TABLE "animals"`)
    await queryRunner.query(`DROP TABLE "users"`)
    await queryRunner.query(`DROP TABLE "accounts"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "quiz_details_selected_option_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "questions_correct_answer_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "animals_order_name_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "animals_animal_origin_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "animals_animal_environment_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "animals_animal_type_enum"`)
  }
}
