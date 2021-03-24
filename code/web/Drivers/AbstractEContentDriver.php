<?php

require_once ROOT_DIR . '/Drivers/AbstractDriver.php';
require_once ROOT_DIR . '/sys/User/AccountSummary.php';

abstract class AbstractEContentDriver extends AbstractDriver
{
	public abstract function getAccountSummary(User $user): AccountSummary;

	/**
	 * @param User $user
	 * @param string $titleId
	 *
	 * @return array
	 */
	public abstract function checkOutTitle($user, $titleId);
}