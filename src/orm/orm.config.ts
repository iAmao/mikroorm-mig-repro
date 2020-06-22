import fs from 'fs';
import path from 'path';
import { Options, EntitySchema } from 'mikro-orm';

const CWD = process.cwd();

// Manually discover entity files.
// This restricts us by making the only thing to export within a .entity file,
// an entity file.
const servicesPath = path.resolve(__dirname, '../service');
const services = fs.readdirSync(servicesPath);
const entities: EntitySchema[] = services.flatMap((service: string) => {
	const serviceEntitiesPath = path.join(servicesPath, service, './entities');
	const serviceEntities = fs.readdirSync(serviceEntitiesPath);
	return serviceEntities
		.filter((entity: string) => entity.search(/\.entity.(js|ts)/) > -1)
		.flatMap((entity: string) =>
			Object.values(
				require(path.join(serviceEntitiesPath, entity)) as EntitySchema
			)
		);
});

const ormConfig: Options = {
	entities,
	discovery: {
		warnWhenNoEntities: true
	},
	dbName: 'mikro_dev',
	type: 'postgresql',
	clientUrl: 'postgresql://postgres@127.0.0.1:5432/mikro_dev',
	baseDir: CWD,
	debug: true,
	autoJoinOneToOneOwner: false,
	propagateToOneOwner: false,
	forceUtcTimezone: true,
	migrations: {
		tableName: 'migrations',
		path: `${CWD}/src/migrations`,
		transactional: true,
		emit: 'ts',
		pattern: /^[\w-]+\d+\.ts$/
	},
	cache: {
		pretty: true,
		options: { cacheDir: `${CWD}/.cache` }
	},
	tsNode: true
};

export default ormConfig;
