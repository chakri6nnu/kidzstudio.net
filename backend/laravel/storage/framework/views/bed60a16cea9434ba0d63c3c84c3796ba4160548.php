<div class="rounded bg-white shadow-md border border-gray-100 pb-4">
    <div class="p-4 lg:p-6">
        <h2 class="text-lg border-b border-gray-200 pb-2 font-semibold text-primary"><?php echo e(__('Billing Information')); ?></h2>
        <div class="mt-4">
            <dl class="space-y-4">
                <div class="flex items-center justify-between">
                    <dt>
                        <?php echo e(__('Full Name')); ?>

                    </dt>
                    <dd class="font-medium text-gray-900">
                        <?php echo e($billing_information['full_name']); ?>

                    </dd>
                </div>
                <div class="flex items-center justify-between">
                    <dt>
                        <?php echo e(__('Email')); ?>

                    </dt>
                    <dd class="font-medium text-gray-900">
                        <?php echo e($billing_information['email']); ?>

                    </dd>
                </div>
                <div class="flex items-center justify-between">
                    <dt>
                        <?php echo e(__('Phone')); ?>

                    </dt>
                    <dd class="font-medium text-gray-900">
                        <?php echo e($billing_information['phone']); ?>

                    </dd>
                </div>
                <div class="flex items-center justify-between">
                    <dt>
                        <?php echo e(__('Address')); ?>

                    </dt>
                    <dd class="font-medium text-gray-900 text-right">
                        <?php echo e($billing_information['address']); ?><br/>
                        <?php echo e($billing_information['city']); ?><br/>
                        <?php echo e($billing_information['state']); ?><br/>
                        <?php echo e($billing_information['country']); ?> - <?php echo e($billing_information['zip']); ?>

                    </dd>
                </div>
            </dl>
        </div>
    </div>
</div>
<?php /**PATH /home/u209201537/domains/kidzstudio.net/public_html/resources/views/store/checkout/partials/_customer_billing_info.blade.php ENDPATH**/ ?>