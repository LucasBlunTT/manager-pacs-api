import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTableRadiologicTechnician1744752729127 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "radiologic_technician",
                columns: [
                    {
                        name: "id",
                        type: "INTEGER",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "nome",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "horario_inicio",
                        type: "time",
                        isNullable: false,
                    },
                    {
                        name: "horario_fim",
                        type: "time",
                        isNullable: false,
                    },
                    {
                        name: "station_name",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("radiologic_technician");
    }

}
