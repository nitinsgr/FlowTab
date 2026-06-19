import { Router, Request, Response } from 'express';
import { CreateQueueItemRequest, QueueListParams } from '@flowtab/shared-types';
import { countWaitingAhead, createQueueItem, findQueueItemById, findQueueItems, getRestaurant, updateQueueItem } from '../models/queue-item';
import { calculateEta } from '../services/eta';


const router = Router();

router.post('/api/v1/restaurants/:restaurantId/queue', async (req: Request, res: Response ) => {
  try{
    const {restaurantId} = req.params;
    const body = req.body as CreateQueueItemRequest;

    if(!body.party_name || typeof body.party_name !== 'string' || body.party_name.trim().length === 0){
      res.status(400).json({error: 'party_name is required'});
      return;
    }
    if(!body.party_size || typeof body.party_size !== 'number' || body.party_size < 1){
      res.status(400).json({error: 'party_size must be positive integer'});
      return;
    }
    if(!body.party_size || typeof body.party_size != 'number' || body.party_size < 1){
      res.status(400).json({error: 'Restaurant not found' });
      return;
    }

    const restaurant = await getRestaurant(restaurantId);
    if(!restaurant){
      res.status(400).json({error: 'Restaurant not found'});
      return;
    }

    const partiesAhead = await countWaitingAhead(restaurantId);

    const etaMinutes = calculateEta({
      partiesAhead:partiesAhead + 1,
      avgServiceRate: Number(restaurant.avg_service_rate),
      avgTableCapacity: restaurant.avg_table_capacity,
      partySize: body.party_size,
    });

    const item = await createQueueItem(restaurantId, body, etaMinutes);
    res.status(201).json(item);
  }
  catch(err){
    console.error('[queue] POST error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
});

router.get('/api/v1/restaurants/:restaurantId/queue', async (req: Request, res: Response ) => {
  try{
    const {restaurantId} = req.params;
    const {status, sort_by, sort_order, limit, offset} = req.query as Record<string, string | undefined>;

    const params: QueueListParams = {
      status: status as QueueListParams['status'],
      sort_by: sort_by as QueueListParams['sort_by'],
      sort_order: sort_order as QueueListParams['sort_order'],
      limit: limit ? parseInt(limit, 10): undefined,
      offset: offset ? parseInt(offset, 10): undefined,
    };

    const items = await findQueueItems(restaurantId, params);
    res.json(items);
  } catch(err){
    console.error('[queue] POST error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
});

router.patch('/api/v1/queue/:id', async (req: Request, res: Response ) => {
  try{
    const {id} = req.params;
    const {priority, notes, status} = req.body;

    if(priority !== undefined && (typeof priority !== 'number' || Number.isInteger(priority))){
      res.status(400).json({error: 'priority must be integer'});
      return;
    }
    if (notes !== undefined && typeof notes !== 'string') {
      res.status(400).json({ error: 'notes must be a string' });
      return;
    }

    if(status !== undefined) {
      const validStatuses = ['waiting', 'seated', 'completed', 'cancelled', 'no_show'];
      if(!validStatuses.includes(status)){
        res.status(400).json({error: `status must be one of ${validStatuses.join(', ')}`});
        return;
      }
    }

    if(priority === undefined && notes === undefined && status === undefined){
      res.status(400).json({error: "At least one field (priority, notes, status must be provided"});
      return;
    }

    const updated = await updateQueueItem(id, { priority, notes, status });
    if (!updated) {
      res.status(404).json({ error: 'Queue item not found' });
      return;
    }

    res.json(updated);

  }catch (err){
    console.error('[queue] POST error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
});
