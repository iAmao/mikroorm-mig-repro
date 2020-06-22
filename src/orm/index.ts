import { MikroORM, RequestContext } from 'mikro-orm';
import ormConfig from './orm.config';

const orm = async (logForkCreation: boolean = false) => {
	const mkorm = await MikroORM.init(ormConfig);

	return {
		fork: (cb?: (args: any) => void) => {
			let next = cb;
			if (typeof cb !== 'function') {
				next = () =>
					logForkCreation ? console.log('[MikroOrm] New RequestContext') : null;
			}
			RequestContext.create(mkorm.em, next as (...args: any[]) => void);
			return mkorm;
		}
	};
};

export default orm;
