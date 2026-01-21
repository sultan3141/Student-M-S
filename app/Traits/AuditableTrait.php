<?php

namespace App\Traits;

use App\Models\AuditLog;

trait AuditableTrait
{
    /**
     * Log an action to the audit trail.
     */
    public static function logAction($action, $description = null, $userId = null)
    {
        $userId = $userId ?? auth()->id();
        
        if (!$userId) {
            return null;
        }

        return AuditLog::create([
            'user_id' => $userId,
            'action' => $action,
            'description' => $description,
            'ip_address' => request()->ip(),
        ]);
    }

    /**
     * Log a model creation.
     */
    public static function logCreated($model, $userId = null)
    {
        return self::logAction(
            'created',
            class_basename($model) . ' #' . $model->id . ' created',
            $userId
        );
    }

    /**
     * Log a model update.
     */
    public static function logUpdated($model, $changes = [], $userId = null)
    {
        $description = class_basename($model) . ' #' . $model->id . ' updated';
        
        if (!empty($changes)) {
            $description .= ': ' . json_encode($changes);
        }

        return self::logAction('updated', $description, $userId);
    }

    /**
     * Log a model deletion.
     */
    public static function logDeleted($model, $userId = null)
    {
        return self::logAction(
            'deleted',
            class_basename($model) . ' #' . $model->id . ' deleted',
            $userId
        );
    }

    /**
     * Log a custom action.
     */
    public static function logCustom($action, $description, $userId = null)
    {
        return self::logAction($action, $description, $userId);
    }
}
