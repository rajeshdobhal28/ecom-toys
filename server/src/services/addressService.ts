import { query } from '../db';
import logger from '../utils/logger';

export interface UserAddress {
    id?: string;
    user_id: number;
    phone_number: number;
    pincode: number;
    state: string;
    city: string;
    address: string;
    is_default?: boolean;
}

export const getAddresses = async (userId: number) => {
    const res = await query(
        'SELECT * FROM user_addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
        [userId]
    );
    return res.rows;
};

export const addAddress = async (addressData: UserAddress) => {
    const existing = await getAddresses(addressData.user_id);
    const isFirst = existing.length === 0;
    const shouldBeDefault = addressData.is_default || isFirst;

    if (shouldBeDefault && !isFirst) {
        await query('UPDATE user_addresses SET is_default = false WHERE user_id = $1', [addressData.user_id]);
    }

    const insertQuery = `
    INSERT INTO user_addresses (user_id, phone_number, pincode, state, city, address, is_default)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
    const res = await query(insertQuery, [
        addressData.user_id,
        addressData.phone_number,
        addressData.pincode,
        addressData.state,
        addressData.city,
        addressData.address,
        shouldBeDefault
    ]);
    return res.rows[0];
};

export const updateAddress = async (id: string, userId: number, updates: Partial<UserAddress>) => {
    if (updates.is_default) {
        await query('UPDATE user_addresses SET is_default = false WHERE user_id = $1', [userId]);
    }

    const setClause: string[] = [];
    const values: any[] = [];
    let paramIdx = 1;

    for (const [key, value] of Object.entries(updates)) {
        if (key !== 'id' && key !== 'user_id' && key !== 'created_at') {
            setClause.push(`${key} = $${paramIdx}`);
            values.push(value);
            paramIdx++;
        }
    }

    if (setClause.length === 0) return null;

    values.push(id);
    values.push(userId);

    const updateQuery = `
    UPDATE user_addresses
    SET ${setClause.join(', ')}
    WHERE id = $${paramIdx - 1} AND user_id = $${paramIdx}
    RETURNING *;
  `;

    const res = await query(updateQuery, values);
    return res.rows[0];
};

export const deleteAddress = async (id: string, userId: number) => {
    // Check if it is the default before deleting
    const addrRes = await query('SELECT is_default FROM user_addresses WHERE id = $1 AND user_id = $2', [id, userId]);
    if (addrRes.rows.length === 0) return false;

    const isDefault = addrRes.rows[0].is_default;

    await query('DELETE FROM user_addresses WHERE id = $1 AND user_id = $2', [id, userId]);

    if (isDefault) {
        // Assign a new default if there are other addresses remaining
        const remaining = await getAddresses(userId);
        if (remaining.length > 0) {
            await query('UPDATE user_addresses SET is_default = true WHERE id = $1', [remaining[0].id]);
        }
    }
    return true;
};

export const setDefaultAddress = async (id: string, userId: number) => {
    await query('BEGIN');
    try {
        await query('UPDATE user_addresses SET is_default = false WHERE user_id = $1', [userId]);
        const res = await query('UPDATE user_addresses SET is_default = true WHERE id = $1 AND user_id = $2 RETURNING *', [id, userId]);
        await query('COMMIT');
        return res.rows[0];
    } catch (error) {
        await query('ROLLBACK');
        throw error;
    }
};
